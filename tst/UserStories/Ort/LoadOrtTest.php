<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/Ort/LoadOrt.php");

final class LoadOrtTest extends TestCase
{
    public function testThereIsNoOrtWithId1()
    {
        $loadOrt = new LoadOrt();
        $loadOrt->setId(1);

        $this->assertFalse($loadOrt->run());
        $this->assertNull($loadOrt->getOrt());
        $this->assertCount(1, $loadOrt->getMessages());
        $this->assertEquals("Es gibt keinen Ort mit der Id 1!", $loadOrt->getMessages()[0]);
    }

    public function testLoadOrtWithId10()
    {
        $loadOrt = new LoadOrt();
        $loadOrt->setId(10);

        $this->assertTrue($loadOrt->run());
        $this->assertInstanceOf(Ort::class, $loadOrt->getOrt());
    }
}
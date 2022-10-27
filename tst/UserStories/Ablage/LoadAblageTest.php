<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../UserStories/Ablage/LoadAblage.php");

final class LoadAblageTest extends TestCase
{
    public function testLoadAblageWithId1()
    {
        $loadAblage = new LoadAblage();
        $loadAblage->setId(1);

        $this->assertTrue($loadAblage->run());
        $this->assertInstanceOf(Ablage::class, $loadAblage->getAblage());
    }
}
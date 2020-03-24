<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../src/UserStories/LfdNummer/LoadLfdNummer.php");

final class LoadLfdNummerTest extends TestCase
{
    public function testThereIsNoLfdNummerWithId1()
    {
        $loadLfdNummer = new LoadLfdNummer();
        $loadLfdNummer->setId(1);

        $this->assertFalse($loadLfdNummer->run());
        $this->assertNull($loadLfdNummer->getLfdNummer());
        $this->assertCount(1, $loadLfdNummer->getMessages());
        $this->assertEquals("Es gibt keine LfD-Nummer mit der Id 1!", $loadLfdNummer->getMessages()[0]);
    }

    public function testLoadLfdNummerWithId2()
    {
        $loadLfdNummer = new LoadLfdNummer();
        $loadLfdNummer->setId(2);

        $this->assertTrue($loadLfdNummer->run());
        $this->assertInstanceOf(LfdNummer::class, $loadLfdNummer->getLfdNummer());
    }
}